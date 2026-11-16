package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idUsuario")
    private Long idUsuario;

    @Column(name = "nome", nullable = false, length = 100) private String nome;

    @Column(name = "email" ,nullable = false, length = 150) private String email;

    @Column(name = "senha", nullable = false, length = 255) private String senha;

    @Column(name = "dataCadastro", nullable = false) private LocalDate dataCadastro;

    @Column(name = "statusConta",nullable = false, length = 20) private String statusConta;

    @OneToMany(mappedBy = "usuario") @JsonIgnore private List<Ocorrencia> ocorrencias;
    @OneToMany(mappedBy = "usuario") @JsonIgnore private List<Avaliacao> avaliacoes;
}
