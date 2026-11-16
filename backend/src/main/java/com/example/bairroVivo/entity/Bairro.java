package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.util.List;

@Entity @Table(name = "bairro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bairro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idBairro")
    private Long idBairro;
    @Column(name = "nome",nullable = false, length = 100) private String nome;
    @Column(name = "cidade",nullable = false, length = 100) private String cidade;
    @Column(name = "uf",nullable = false, length = 2) private String uf;
    @OneToMany(mappedBy = "bairro") @JsonIgnore private List<Localizacao> localizacoes;
}
