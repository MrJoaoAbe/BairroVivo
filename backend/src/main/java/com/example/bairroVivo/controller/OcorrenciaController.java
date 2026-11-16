package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Ocorrencia;
import com.example.bairroVivo.service.OcorrenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ocorrencia")
public class OcorrenciaController {
    private final OcorrenciaService service;
    public OcorrenciaController(OcorrenciaService service) { this.service = service; }
    @GetMapping public List<Ocorrencia> listarOcorrencias() { return service.listarOcorrencias(); }
    @GetMapping("/{id}") public ResponseEntity<Ocorrencia> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarOcorrencia(id)); }
    @PostMapping public ResponseEntity<Ocorrencia> inserir(@RequestBody Ocorrencia x) { return ResponseEntity.ok(service.inserirOcorrencia(x)); }
    @PutMapping("/{id}") public ResponseEntity<Ocorrencia> atualizar(@PathVariable Long id, @RequestBody Ocorrencia x) { return ResponseEntity.ok(service.atualizarOcorrencia(id, x)); }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ocorrencia> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> dados) {

        return ResponseEntity.ok(
                service.atualizarStatus(id, dados.get("status"))
        );
    }
}
