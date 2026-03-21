package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.dto.RespostaDTO;
import br.pucgo.ads.projetointegrador.diario_saude.dto.RespostaQuestionarioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PerguntaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.service.RespostaQuestionarioService;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diario_saude/questionario")
public class QuestionarioRespostaController {

        private final RespostaQuestionarioService respostaService;
        private final PerguntaRepository perguntaRepository;
        private final UserRepository userRepository;

        public QuestionarioRespostaController(
                        RespostaQuestionarioService respostaService,
                        PerguntaRepository perguntaRepository,
                        UserRepository userRepository) {
                this.respostaService = respostaService;
                this.perguntaRepository = perguntaRepository;
                this.userRepository = userRepository;
        }

        @PostMapping("/responder/{usuarioId}")
        public ResponseEntity<?> responderQuestionario(
                        @PathVariable Long usuarioId,
                        @RequestBody List<RespostaDTO> respostasDto) {

                User usuario = userRepository.findById(usuarioId)
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                List<RespostaQuestionarioEntity> respostasEntity = respostasDto.stream()
                                .map(dto -> {
                                        PerguntaEntity pergunta = perguntaRepository.findById(dto.getPerguntaId())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Pergunta não encontrada: id="
                                                                                        + dto.getPerguntaId()));
                                        return new RespostaQuestionarioEntity(usuario, pergunta, dto.getResposta(),
                                                        dto.getPeso());
                                })
                                .collect(Collectors.toList());

                respostaService.salvarRespostas(respostasEntity);

                int pontuacaoTotal = respostaService.calcularPontuacaoTotal(usuario);

                return ResponseEntity.ok(Map.of(
                                "mensagem", "Questionário finalizado!",
                                "pontuacao", pontuacaoTotal));
        }

        @GetMapping("/respostas/{usuarioId}")
        public ResponseEntity<?> obterRespostas(@PathVariable Long usuarioId) {
                User usuario = userRepository.findById(usuarioId)
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                List<RespostaQuestionarioEntity> respostas = respostaService.buscarPorUsuario(usuario);

                // ✅ Mapeia para DTO simples — evita serializar User/Role/permissions (lazy
                // load)
                List<RespostaQuestionarioDTO> dto = respostas.stream()
                                .map(r -> new RespostaQuestionarioDTO(
                                                r.getPergunta().getId(),
                                                r.getPergunta().getTexto(),
                                                r.getResposta(),
                                                r.getPeso()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(dto);
        }
}