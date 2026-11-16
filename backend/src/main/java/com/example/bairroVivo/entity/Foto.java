package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "foto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Foto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idFoto")
    private Long idFoto;
    @ManyToOne @JoinColumn(name = "idOcorrencia", nullable = false, foreignKey = @ForeignKey(name = "fk_foto_ocorrencia")) private Ocorrencia ocorrencia;
    @Column(name = "urlImagem",nullable = false, length = 500) private String urlImagem;
    @Column(name = "dataUpload",nullable = false) private LocalDate dataUpload;
}
