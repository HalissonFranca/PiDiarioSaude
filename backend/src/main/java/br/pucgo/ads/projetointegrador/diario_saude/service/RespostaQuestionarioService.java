package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
<<<<<<< HEAD
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.RespostaQuestionarioRepository;
=======
import br.pucgo.ads.projetointegrador.diario_saude.repository.RespostaQuestionarioRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User; // ✅ trocado de UsuarioEntity
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RespostaQuestionarioService {

    private final RespostaQuestionarioRepository respostaRepository;

    public RespostaQuestionarioService(RespostaQuestionarioRepository respostaRepository) {
        this.respostaRepository = respostaRepository;
    }

<<<<<<< HEAD
    public List<RespostaQuestionarioEntity> buscarPorUsuario(UsuarioEntity usuario) {
=======
    public List<RespostaQuestionarioEntity> buscarPorUsuario(User usuario) {
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
        return respostaRepository.findByUsuario(usuario);
    }

    @Transactional
    public void salvarRespostas(List<RespostaQuestionarioEntity> respostas) {
        for (RespostaQuestionarioEntity r : respostas) {
<<<<<<< HEAD
            // verifica se já existe uma resposta para esse usuário e pergunta
            RespostaQuestionarioEntity existente = respostaRepository
                    .findByUsuarioAndPergunta(r.getUsuario(), r.getPergunta())
                    .orElse(null);

            if (existente != null) {
                // atualiza se já existir
                existente.setResposta(r.getResposta());
                existente.setPeso(r.getPeso());
                respostaRepository.save(existente);
            } else {
                respostaRepository.save(r);
            }
        }
    }

    public int calcularPontuacaoTotal(UsuarioEntity usuario) {
        List<RespostaQuestionarioEntity> respostas = buscarPorUsuario(usuario);
        return respostas.stream().mapToInt(RespostaQuestionarioEntity::getPeso).sum();
=======
            respostaRepository
                    .findByUsuarioAndPergunta(r.getUsuario(), r.getPergunta())
                    .ifPresentOrElse(
                            existente -> {
                                // ✅ Atualiza resposta existente
                                existente.setResposta(r.getResposta());
                                existente.setPeso(r.getPeso());
                                respostaRepository.save(existente);
                            },
                            () -> respostaRepository.save(r) // ✅ Cria nova
                    );
        }
    }

    public int calcularPontuacaoTotal(User usuario) {
        return buscarPorUsuario(usuario)
                .stream()
                .mapToInt(RespostaQuestionarioEntity::getPeso)
                .sum();
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
    }
}
