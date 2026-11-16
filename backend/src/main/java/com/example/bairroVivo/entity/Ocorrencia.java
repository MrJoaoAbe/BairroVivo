package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "ocorrencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ocorrencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idOcorrencia")
    private Long idOcorrencia;
    @ManyToOne @JoinColumn(name = "idUsuario", nullable = false, foreignKey = @ForeignKey(name = "fk_ocorrencia_usuario")) private Usuario usuario;
    @ManyToOne @JoinColumn(name = "idLocalizacao", nullable = false, foreignKey = @ForeignKey(name = "fk_ocorrencia_localizacao")) private Localizacao localizacao;
    @ManyToOne @JoinColumn(name = "idCategoria", nullable = false, foreignKey = @ForeignKey(name = "fk_ocorrencia_categoria")) private Categoria categoria;
    @Column(name = "titulo",nullable = false, length = 150) private String titulo;
    @Column(name = "descricao",nullable = false, length = 500) private String descricao;
    @Column(name = "status",nullable = false, length = 30) private String status;
    @Column(name = "dataCriacao",nullable = false) private LocalDate dataCriacao;
    private LocalDate dataResolucao;
    @OneToMany(mappedBy = "ocorrencia") @JsonIgnore private List<Avaliacao> avaliacoes;
    @OneToMany(mappedBy = "ocorrencia") @JsonIgnore private List<Foto> fotos;
}
