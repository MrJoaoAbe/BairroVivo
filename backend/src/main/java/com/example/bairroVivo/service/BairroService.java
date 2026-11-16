package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.Bairro;
import com.example.bairroVivo.repository.BairroRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BairroService {
    private final BairroRepository repository;
    public BairroService(BairroRepository repository) { this.repository = repository; }
    public List<Bairro> listarBairros() { return repository.findAll(); }
    public Bairro buscarBairro(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Bairro não encontrado(a)")); }
    public Bairro inserirBairro(Bairro x) { return repository.save(x); }
    public Bairro atualizarBairro(Long id, Bairro x)
    { Bairro e = buscarBairro(id);
        e.setNome(x.getNome());
        e.setCidade(x.getCidade());
        e.setUf(x.getUf());
        return repository.save(e); }
}
