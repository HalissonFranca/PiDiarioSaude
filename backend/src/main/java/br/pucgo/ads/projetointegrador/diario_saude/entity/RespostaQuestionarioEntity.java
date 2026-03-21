package br.pucgo.ads.projetointegrador.diario_saude.entity;

<<<<<<< HEAD
=======
<<<<<<< HEAD
import jakarta.persistence.*;

@Entity
@Table(name = "ds_resposta_questionario")
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
import br.pucgo.ads.projetointegrador.plataforma.entity.User; // ✅ trocado de UsuarioEntity
import jakarta.persistence.*;

@Entity
@Table(name = "ds_resposta_questionario",
        // ✅ Garante que um usuário não responda a mesma pergunta duas vezes
        uniqueConstraints = @UniqueConstraint(columnNames = { "usuario_id", "pergunta_id" }))
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
public class RespostaQuestionarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
=======
<<<<<<< HEAD
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    // ✅ Agora aponta para a tabela 'users' da plataforma
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829

    @ManyToOne
    @JoinColumn(name = "pergunta_id", nullable = false)
    private PerguntaEntity pergunta;

    @Column(nullable = false)
    private String resposta;

    @Column(nullable = false)
    private int peso;

<<<<<<< HEAD
=======
<<<<<<< HEAD
    public RespostaQuestionarioEntity() {}

    public RespostaQuestionarioEntity(UsuarioEntity usuario, PerguntaEntity pergunta, String resposta, int peso) {
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public RespostaQuestionarioEntity() {
    }

    public RespostaQuestionarioEntity(User usuario, PerguntaEntity pergunta, String resposta, int peso) {
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
        this.usuario = usuario;
        this.pergunta = pergunta;
        this.resposta = resposta;
        this.peso = peso;
    }

<<<<<<< HEAD
=======
<<<<<<< HEAD
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }

    public PerguntaEntity getPergunta() { return pergunta; }
    public void setPergunta(PerguntaEntity pergunta) { this.pergunta = pergunta; }

    public String getResposta() { return resposta; }
    public void setResposta(String resposta) { this.resposta = resposta; }

    public int getPeso() { return peso; }
    public void setPeso(int peso) { this.peso = peso; }
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    public PerguntaEntity getPergunta() {
        return pergunta;
    }

    public void setPergunta(PerguntaEntity pergunta) {
        this.pergunta = pergunta;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        this.resposta = resposta;
    }

    public int getPeso() {
        return peso;
    }

    public void setPeso(int peso) {
        this.peso = peso;
    }
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
}
