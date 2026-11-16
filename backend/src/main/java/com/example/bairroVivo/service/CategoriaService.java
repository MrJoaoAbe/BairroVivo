package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.Categoria;
import com.example.bairroVivo.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository repository;
    public CategoriaService(CategoriaRepository repository) { this.repository = repository; }
    public List<Categoria> listarCategorias() { return repository.findAll(); }
    public Categoria buscarCategoria(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrado(a)")); }
    public Categoria inserirCategoria(Categoria x) { validar(x); return repository.save(x); }
    public Categoria atualizarCategoria(Long id, Categoria x)
    { Categoria e = buscarCategoria(id);
        validar(x);
        e.setNome(x.getNome());
        e.setDescricao(x.getDescricao());
        e.setGravidade(x.getGravidade());
        return repository.save(e); }
    private void validar(Categoria x)
    { if (x.getGravidade() == null || x.getGravidade() < 0 || x.getGravidade() > 10)
        throw new IllegalArgumentException("Gravidade deve estar entre 0 e 10"); }
}
