package com.yourcompany.krs.models

import kotlinx.serialization.Serializable

@Serializable
data class GenericResponse(val success: Boolean, val message: String)

@Serializable
data class RegisterSuccessResponse(val success: Boolean, val nim: String)

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

@Serializable
data class KRSSingleResponse(
    val krsId: Int,
    val status: String,
    val matakuliah: List<MatakuliahResponse>
)

@Serializable
data class KRSListResponse(
    val success: Boolean,
    val krs: List<KRSSingleResponse>
)

@Serializable
data class NilaiResponse(
    val matakuliah: String,
    val sks: Int,
    val dosen: String,
    val nilai: String?,
    val keterangan: String?
)

@Serializable
data class NilaiListResponse(
    val success: Boolean,
    val nilai: List<NilaiResponse>
)

@Serializable
data class MahasiswaInClassResponse(
    val krsDetailId: Int,
    val nim: String,
    val nama: String,
    val nilai: String?,
    val keterangan: String?
)

@Serializable
data class MatkulDosenResponse(
    val id: Int,
    val kode: String,
    val nama: String,
    val sks: Int,
    val ruangan: String,
    val jamMulai: String,
    val mahasiswa: List<MahasiswaInClassResponse>
)