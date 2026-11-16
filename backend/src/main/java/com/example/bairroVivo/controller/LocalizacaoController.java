package com.example.bairroVivo.controller;

import com.example.bairroVivo.entity.Localizacao;
import com.example.bairroVivo.service.LocalizacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/localizacao")
public class LocalizacaoController {
    private final LocalizacaoService service;
    public LocalizacaoController(LocalizacaoService service) { this.service = service; }
    @GetMapping public List<Localizacao> listarLocalizacoes() { return service.listarLocalizacoes(); }
    @GetMapping("/{id}") public ResponseEntity<Localizacao> buscar(@PathVariable Long id) { return ResponseEntity.ok(service.buscarLocalizacao(id)); }
    @PostMapping public ResponseEntity<Localizacao> inserir(@RequestBody Localizacao x) { return ResponseEntity.ok(service.inserirLocalizacao(x)); }
    @PutMapping("/{id}") public ResponseEntity<Localizacao> atualizar(@PathVariable Long id, @RequestBody Localizacao x) { return ResponseEntity.ok(service.atualizarLocalizacao(id, x)); }
}
