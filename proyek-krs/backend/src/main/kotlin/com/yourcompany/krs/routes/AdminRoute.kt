package com.yourcompany.krs.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import com.yourcompany.krs.models.*

fun Application.adminRoute() {
    routing {
        get("/admin/mahasiswa") {
            val mahasiswaList = transaction {
                MahasiswaTable.selectAll().map {
                    mapOf(
                        "nim" to it[MahasiswaTable.nim],
                        "nama" to it[MahasiswaTable.nama],
                        "dpaId" to it[MahasiswaTable.dpaId]
                    )
                }
            }
            call.respond(mapOf("success" to true, "mahasiswa" to mahasiswaList))
        }
        get("/admin/dosen") {
            val dosenList = transaction {
                DosenTable.selectAll().map {
                    mapOf(
                        "nidn" to it[DosenTable.nidn],
                        "nama" to it[DosenTable.nama]
                    )
                }
            }
            call.respond(mapOf("success" to true, "dosen" to dosenList))
        }
        get("/admin/matakuliah") {
            val matkulList = transaction {
                MataKuliahTable.selectAll().map {
                    mapOf(
                        "kode" to it[MataKuliahTable.kode],
                        "nama" to it[MataKuliahTable.nama],
                        "sks" to it[MataKuliahTable.sks],
                        "dosenId" to it[MataKuliahTable.dosenId],
                        "ruangan" to it[MataKuliahTable.ruangan],
                        "jamMulai" to it[MataKuliahTable.jamMulai]
                    )
                }
            }
            call.respond(mapOf("success" to true, "matakuliah" to matkulList))
        }
    }
}
