package com.yourcompany.krs.routes

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.yourcompany.krs.models.*

fun Application.nilaiRoute() {
    routing {
        post("/nilai/input") {
            val params = call.receiveParameters()
            val krsDetailId = params["krsDetailId"]?.toIntOrNull() ?: return@post call.respond(mapOf("success" to false, "message" to "ID wajib diisi"))
            val nilai = params["nilai"]
            val keterangan = params["keterangan"]
            transaction {
                if (NilaiTable.select { NilaiTable.krsDetailId eq krsDetailId }.empty()) {
                    NilaiTable.insert {
                        it[NilaiTable.krsDetailId] = krsDetailId
                        it[NilaiTable.nilai] = nilai
                        it[NilaiTable.keterangan] = keterangan
                    }
                } else {
                    NilaiTable.update({ NilaiTable.krsDetailId eq krsDetailId }) {
                        it[NilaiTable.nilai] = nilai
                        it[NilaiTable.keterangan] = keterangan
                    }
                }
            }
            call.respond(mapOf("success" to true))
        }
        get("/nilai/{nim}") {
            val nim = call.parameters["nim"] ?: return@get call.respond(mapOf("success" to false, "message" to "NIM wajib diisi"))
            val mahasiswaId = transaction { MahasiswaTable.select { MahasiswaTable.nim eq nim }.singleOrNull()?.get(MahasiswaTable.id)?.value }
            if (mahasiswaId == null) return@get call.respond(mapOf("success" to false, "message" to "Mahasiswa tidak ditemukan"))
            val nilaiList = transaction {
                (KRSTable innerJoin KRSDetailTable innerJoin MataKuliahTable leftJoin NilaiTable)
                    .select { KRSTable.mahasiswaId eq mahasiswaId }
                    .map {
                        mapOf(
                            "matkul" to it[MataKuliahTable.nama],
                            "nilai" to it[NilaiTable.nilai],
                            "keterangan" to it[NilaiTable.keterangan]
                        )
                    }
            }
            call.respond(mapOf("success" to true, "nilai" to nilaiList))
        }
    }
}
