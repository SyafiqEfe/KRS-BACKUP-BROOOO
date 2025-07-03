package com.yourcompany.krs.routes

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import com.yourcompany.krs.models.*

fun Application.mahasiswaRoute() {
    routing {
        post("/register") {
            val params = call.receiveParameters()
            val nama = params["nama"] ?: return@post call.respond(mapOf("success" to false, "message" to "Nama wajib diisi"))
            val password = params["password"] ?: return@post call.respond(mapOf("success" to false, "message" to "Password wajib diisi"))
            var nim: String? = null
            transaction {
                val id = MahasiswaTable.insert {
                    it[MahasiswaTable.nama] = nama
                    it[MahasiswaTable.password] = password
                } get MahasiswaTable.id
                nim = "NIM${id.value.toString().padStart(5, '0')}"
                MahasiswaTable.update({ MahasiswaTable.id eq id.value }) {
                    it[MahasiswaTable.nim] = nim!!
                }
            }
            call.respond(mapOf("success" to true, "nim" to nim))
        }
    }
}
