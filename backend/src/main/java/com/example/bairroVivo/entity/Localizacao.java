package com.example.bairroVivo.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = "localizacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Localizacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @Column(name = "idLocalizacao")
    private Long idLocalizacao;

    @Column(name = "latitude",precision = 10, scale = 7, nullable = false) private BigDecimal latitude;
    @Column(name = "longitude", precision = 10, scale = 7,nullable = false) private BigDecimal longitude;

    @Column(name = "numero",nullable = false, length = 20) private String numero;
    @Column(name = "rua",nullable = false, length = 100) private String rua;
    @Column(name = "pontoReferencia",length = 150) private String pontoReferencia;
    @Column(name = "complemento",length = 200) private String complemento;
    @ManyToOne @JoinColumn(name = "idBairro", nullable = false, foreignKey = @ForeignKey(name = "fk_localizacao_bairro"))
    private Bairro bairro;
    @OneToMany(mappedBy = "localizacao") @JsonIgnore private List<Ocorrencia> ocorrencias;
}
