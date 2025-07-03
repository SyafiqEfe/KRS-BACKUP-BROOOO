package com.yourcompany.krs.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.yourcompany.krs.models.*

fun Application.dosenKRSRoute() {
    routing {
        get("/dosen/{nidn}/matkul") {
            val nidn = call.parameters["nidn"] ?: return@get call.respond(mapOf("success" to false, "message" to "NIDN wajib diisi"))
            val dosenId = transaction { DosenTable.select { DosenTable.nidn eq nidn }.singleOrNull()?.get(DosenTable.id)?.value }
            if (dosenId == null) return@get call.respond(mapOf("success" to false, "message" to "Dosen tidak ditemukan"))
            val matkulList = transaction {
                MataKuliahTable.select { MataKuliahTable.dosenId eq dosenId }.map {
                    mapOf(
                        "id" to it[MataKuliahTable.id].value,
                        "kode" to it[MataKuliahTable.kode],
                        "nama" to it[MataKuliahTable.nama],
                        "sks" to it[MataKuliahTable.sks],
                        "ruangan" to it[MataKuliahTable.ruangan],
                        "jamMulai" to it[MataKuliahTable.jamMulai]
                    )
                }
            }
            call.respond(mapOf("success" to true, "matakuliah" to matkulList))
        }
        get("/dosen/{nidn}/matkul/{matkulId}/mahasiswa") {
            val matkulId = call.parameters["matkulId"]?.toIntOrNull() ?: return@get call.respond(mapOf("success" to false, "message" to "ID matkul wajib"))
            val mahasiswaList = transaction {
                (KRSDetailTable innerJoin KRSTable innerJoin MahasiswaTable)
                    .select { KRSDetailTable.matkulId eq matkulId }
                    .map {
                        mapOf(
                            "nim" to it[MahasiswaTable.nim],
                            "nama" to it[MahasiswaTable.nama],
                            "krsDetailId" to it[KRSDetailTable.id].value
                        )
                    }
            }
            call.respond(mapOf("success" to true, "mahasiswa" to mahasiswaList))
        }
    }
}
