package com.example.bairroVivo.service;

import com.example.bairroVivo.entity.Avaliacao;
import com.example.bairroVivo.repository.AvaliacaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AvaliacaoService {
    private final AvaliacaoRepository repository;
    public AvaliacaoService(AvaliacaoRepository repository) {
        this.repository = repository; }
    public List<Avaliacao> listarAvaliacoes() {
        return repository.findAll(); }
    public Avaliacao buscarAvaliacao(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Avaliacao não encontrado(a)")); }
    public Avaliacao inserirAvaliacao(Avaliacao x) {
        validar(x);
        if (x.getDataAvaliacao() == null)
            x.setDataAvaliacao(java.time.LocalDate.now());

        return repository.save(x); }
    public Avaliacao atualizarAvaliacao(Long id, Avaliacao x)
    { Avaliacao e = buscarAvaliacao(id);
        validar(x);
        e.setVoto(x.getVoto());
        e.setUsuario(x.getUsuario());
        e.setOcorrencia(x.getOcorrencia());
        return repository.save(e); }
    private void validar(Avaliacao x)
    { if (x.getVoto() == null || (x.getVoto() != 1 && x.getVoto() != -1))
        throw new IllegalArgumentException("Voto deve ser 1 ou -1"); }
}
