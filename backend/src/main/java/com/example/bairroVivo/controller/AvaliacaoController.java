package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Avaliacao;
import com.example.bairroVivo.service.AvaliacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/avaliacao")
public class AvaliacaoController {
    private final AvaliacaoService service;
    public AvaliacaoController(AvaliacaoService service) { this.service = service; }
    @GetMapping public List<Avaliacao> listarAvaliacoes() { return service.listarAvaliacoes(); }
    @GetMapping("/{id}") public ResponseEntity<Avaliacao> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarAvaliacao(id)); }
    @PostMapping public ResponseEntity<Avaliacao> inserir(@RequestBody Avaliacao x) { return ResponseEntity.ok(service.inserirAvaliacao(x)); }
    @PutMapping("/{id}") public ResponseEntity<Avaliacao> atualizar(@PathVariable Long id, @RequestBody Avaliacao x) { return ResponseEntity.ok(service.atualizarAvaliacao(id, x)); }
}
