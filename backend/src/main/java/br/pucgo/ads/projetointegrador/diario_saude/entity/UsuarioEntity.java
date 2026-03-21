package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import jakarta.persistence.OneToMany;

<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
@Entity
@Table(name = "usuario_info_clinica")
public class UsuarioEntity {

<<<<<<< HEAD
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
=======
<<<<<<< HEAD
    @Id//chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto incremental
=======
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    @Column(name = "id_usuario")
    private long idUsuario;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private int idade;

    @Column(nullable = false)
    private float peso;

    @Column(nullable = false)
    private float altura;

<<<<<<< HEAD
=======
<<<<<<< HEAD
    @Column(name = "user_id")
    private Long userId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List<PrescricaoMedicaEntity> prescricoesMedicas;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UsuarioDoencasEntity> usuarioDoencas;

<<<<<<< HEAD
=======
<<<<<<< HEAD
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RespostaQuestionarioEntity> respostasQuestionario;

    public UsuarioEntity(UsuarioDTO usuario){
        BeanUtils.copyProperties(usuario, this);
    }
    public UsuarioEntity(){
        
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    // ✅ Removido @OneToMany de respostasQuestionario —
    // o questionário agora usa User (tabela 'users') como dono do relacionamento

    public UsuarioEntity(UsuarioDTO usuario) {
        BeanUtils.copyProperties(usuario, this);
    }

    public UsuarioEntity() {
<<<<<<< HEAD
=======
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (int) (idUsuario ^ (idUsuario >>> 32));
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UsuarioEntity other = (UsuarioEntity) obj;
<<<<<<< HEAD
        return idUsuario == other.idUsuario;
=======
<<<<<<< HEAD
        if (idUsuario != other.idUsuario)
            return false;
        return true;
    }

    public List<RespostaQuestionarioEntity> getRespostasQuestionario() {
        return respostasQuestionario;
    }

    public void setRespostasQuestionario(List<RespostaQuestionarioEntity> respostasQuestionario) {
        this.respostasQuestionario = respostasQuestionario;
=======
        return idUsuario == other.idUsuario;
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
    }

    public long getId_usuario() {
        return idUsuario;
    }

    public void setId_usuario(long id_usuario) {
        this.idUsuario = id_usuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public float getPeso() {
        return peso;
    }

    public void setPeso(float peso) {
        this.peso = peso;
    }

    public float getAltura() {
        return altura;
    }

    public void setAltura(float altura) {
        this.altura = altura;
    }
<<<<<<< HEAD
=======
<<<<<<< HEAD
    
    public List<PrescricaoMedicaEntity> getPrescricoesMedicas() {
        return prescricoesMedicas;
    }
    public void setPrescricoesMedicas(List<PrescricaoMedicaEntity> prescricoesMedicas) {
        this.prescricoesMedicas = prescricoesMedicas;
    }
    public List<UsuarioDoencasEntity> getUsuarioDoencas() {
        return usuarioDoencas;
    }
    public void setUsuarioDoencas(List<UsuarioDoencasEntity> usuarioDoencas) {
        this.usuarioDoencas = usuarioDoencas;
    }
    
}
=======
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829

    public List<PrescricaoMedicaEntity> getPrescricoesMedicas() {
        return prescricoesMedicas;
    }

    public void setPrescricoesMedicas(List<PrescricaoMedicaEntity> prescricoesMedicas) {
        this.prescricoesMedicas = prescricoesMedicas;
    }

    public List<UsuarioDoencasEntity> getUsuarioDoencas() {
        return usuarioDoencas;
    }

    public void setUsuarioDoencas(List<UsuarioDoencasEntity> usuarioDoencas) {
        this.usuarioDoencas = usuarioDoencas;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
