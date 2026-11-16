package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.util.List;

@Entity @Table(name = "categoria")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idCategoria")
    private Long idCategoria;
    @Column(name = "nome",nullable = false, length = 100) private String nome;
    @Column(name = "descricao",length = 255) private String descricao;
    @Column(name = "gravidade",nullable = false) private Integer gravidade;
    @OneToMany(mappedBy = "categoria") @JsonIgnore private List<Ocorrencia> ocorrencias;
}
