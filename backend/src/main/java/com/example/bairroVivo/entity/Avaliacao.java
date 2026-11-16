package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "avaliacao", uniqueConstraints = @UniqueConstraint(name = "uk_avaliacao_usuario_ocorrencia", columnNames = {"idUsuario", "idOcorrencia"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idAvaliacao")
    private Long idAvaliacao;
    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false, foreignKey = @ForeignKey(name = "fk_avaliacao_usuario"))
    private Usuario usuario;
    @ManyToOne @JoinColumn(name = "idOcorrencia", nullable = false, foreignKey = @ForeignKey(name = "fk_avaliacao_ocorrencia"))
    private Ocorrencia ocorrencia;
    @Column(name = "voto",nullable = false)
    private Integer voto;
    @Column(name = "dataAvaliacao",nullable = false)
    private LocalDate dataAvaliacao;
}
