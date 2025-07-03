package com.yourcompany.krs.routes

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import com.yourcompany.krs.models.*
import org.jetbrains.exposed.dao.id.EntityID

fun Application.krsRoute() {
    routing {
        post("/krs/submit") {
            val params = call.receiveParameters()
            val nim = params["nim"] ?: return@post call.respond(mapOf("success" to false, "message" to "NIM wajib diisi"))
            val matkulIds = params.getAll("matkulIds[]")?.mapNotNull { it.toIntOrNull() } ?: emptyList()
            val mahasiswaId = transaction { MahasiswaTable.select { MahasiswaTable.nim eq nim }.singleOrNull()?.get(MahasiswaTable.id)?.value }
            if (mahasiswaId == null) return@post call.respond(mapOf("success" to false, "message" to "Mahasiswa tidak ditemukan"))
            val totalSks = transaction {
                MataKuliahTable.select { MataKuliahTable.id inList matkulIds }.sumOf { it[MataKuliahTable.sks] }
            }
            if (totalSks < 19 || totalSks > 24) return@post call.respond(mapOf("success" to false, "message" to "SKS harus 19-24"))
            val krsId = transaction {
                KRSTable.insertAndGetId {
                    it[KRSTable.mahasiswaId] = org.jetbrains.exposed.dao.id.EntityID(mahasiswaId, MahasiswaTable)
                    it[KRSTable.status] = "Diajukan"
                }.value
            }
            transaction {
                matkulIds.forEach { mid ->
                    KRSDetailTable.insert {
                        it[KRSDetailTable.krsId] = org.jetbrains.exposed.dao.id.EntityID(krsId, KRSTable)
                        it[KRSDetailTable.matkulId] = org.jetbrains.exposed.dao.id.EntityID(mid, MataKuliahTable)
                    }
                }
            }
            call.respond(mapOf("success" to true, "krsId" to krsId))
        }
        get("/krs/{nim}") {
            val nim = call.parameters["nim"] ?: return@get call.respond(mapOf("success" to false, "message" to "NIM wajib diisi"))
            val mahasiswaId = transaction { MahasiswaTable.select { MahasiswaTable.nim eq nim }.singleOrNull()?.get(MahasiswaTable.id)?.value }
            if (mahasiswaId == null) return@get call.respond(mapOf("success" to false, "message" to "Mahasiswa tidak ditemukan"))
            val krsList = transaction {
                KRSTable.select { KRSTable.mahasiswaId eq mahasiswaId }.map { krsRow ->
                    val krsId = krsRow[KRSTable.id].value
                    val matkul = KRSDetailTable.select { KRSDetailTable.krsId eq krsId }.map { detailRow ->
                        val mk = MataKuliahTable.select { MataKuliahTable.id eq detailRow[KRSDetailTable.matkulId] }.single()
                        mapOf(
                            "kode" to mk[MataKuliahTable.kode],
                            "nama" to mk[MataKuliahTable.nama],
                            "sks" to mk[MataKuliahTable.sks],
                            "ruangan" to mk[MataKuliahTable.ruangan],
                            "jamMulai" to mk[MataKuliahTable.jamMulai],
                            "dosen" to DosenTable.select { DosenTable.id eq mk[MataKuliahTable.dosenId] }.single()[DosenTable.nama]
                        )
                    }
                    mapOf(
                        "krsId" to krsId,
                        "status" to krsRow[KRSTable.status],
                        "matakuliah" to matkul
                    )
                }
            }
            call.respond(mapOf("success" to true, "krs" to krsList))
        }
    }
}
