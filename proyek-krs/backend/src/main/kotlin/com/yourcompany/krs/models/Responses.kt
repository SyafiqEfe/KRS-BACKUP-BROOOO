package com.yourcompany.krs.models

import kotlinx.serialization.Serializable

// Respons untuk daftar mata kuliah
@Serializable
data class MatakuliahResponse(
    val id: Int,
    val kode: String,
    val nama: String,
    val sks: Int,
    val dosen: String,
    val ruangan: String,
    val jamMulai: String
)

// Respons untuk satu item KRS
@Serializable
data class KRSSingleResponse(
    val krsId: Int,
    val status: String,
    val matakuliah: List<MatakuliahResponse>
)

// Anda bisa menambahkan data class lain di sini jika dibutuhkan
// misalnya untuk Nilai, dll.