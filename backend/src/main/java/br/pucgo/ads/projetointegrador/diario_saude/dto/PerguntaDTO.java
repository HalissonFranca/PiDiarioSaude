package br.pucgo.ads.projetointegrador.diario_saude.dto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PerguntaDTO {
    private Long id;
    private String texto;
    private List<OpcaoDTO> opcoes; // Lista de opções com peso

<<<<<<< HEAD
    public PerguntaDTO() {
    }
=======
<<<<<<< HEAD
    public PerguntaDTO() {}
=======
    public PerguntaDTO() {
    }
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829

    // Construtor que recebe Map e converte para List<OpcaoDTO>
    public PerguntaDTO(Long id, String texto, Map<String, Integer> opcoesMap) {
        this.id = id;
        this.texto = texto;
        this.opcoes = opcoesMap.entrySet().stream()
                .map(entry -> new OpcaoDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // getters e setters
    public Long getId() {
        return id;
    }
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public void setTexto(String texto) {
        this.texto = texto;
    }

    public List<OpcaoDTO> getOpcoes() {
        return opcoes;
    }
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public void setOpcoes(List<OpcaoDTO> opcoes) {
        this.opcoes = opcoes;
    }
}

// Classe auxiliar para cada opção
class OpcaoDTO {
    private String texto;
    private int peso;

<<<<<<< HEAD
    public OpcaoDTO() {
    }
=======
<<<<<<< HEAD
    public OpcaoDTO() {}
=======
    public OpcaoDTO() {
    }
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829

    public OpcaoDTO(String texto, int peso) {
        this.texto = texto;
        this.peso = peso;
    }

    // getters e setters
    public String getTexto() {
        return texto;
    }
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public void setTexto(String texto) {
        this.texto = texto;
    }

    public int getPeso() {
        return peso;
    }
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public void setPeso(int peso) {
        this.peso = peso;
    }
}
