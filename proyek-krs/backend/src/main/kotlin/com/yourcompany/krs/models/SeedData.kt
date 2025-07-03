package com.yourcompany.krs.models

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction

object SeedData {
    fun insertInitialData() {
        transaction {
            SchemaUtils.create(MahasiswaTable, DosenTable, MataKuliahTable, KRSTable, KRSDetailTable, NilaiTable, AdminTable)

            // Admin default
            if (AdminTable.selectAll().empty()) {
                AdminTable.insert {
                    it[username] = "admin"
                    it[password] = "admin123" // hash in production
                }
            }

            // Dosen
            if (DosenTable.selectAll().empty()) {
                for (i in 1..10) {
                    DosenTable.insert {
                        it[nidn] = "NIDN00$i"
                        it[nama] = "Dosen $i"
                        it[password] = "dosen$i"
                    }
                }
            }

            // Mata Kuliah
            if (MataKuliahTable.selectAll().empty()) {
                for (i in 1..10) {
                    MataKuliahTable.insert {
                        it[kode] = "MK00$i"
                        it[nama] = "Mata Kuliah $i"
                        it[sks] = 2 + (i % 4) // 2-5 sks
                        it[dosenId] = i
                        it[ruangan] = "Ruang ${i}A"
                        it[jamMulai] = "0${8 + i}:00"
                    }
                }
            }
        }
    }
}
