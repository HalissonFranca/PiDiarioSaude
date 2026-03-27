package br.pucgo.ads.projetointegrador.diario_saude.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrationConfig.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void executarMigracoes() {
        corrigirFkRespostaQuestionario(); // ✅ método abaixo
        adicionarFkUsuarioInfoClinica(); // ✅ método abaixo
    }

    // ── Correção original do projeto ─────────────────────────────────────────
    private void corrigirFkRespostaQuestionario() {
        try {
            Integer count = jdbcTemplate.queryForObject("""
                    SELECT COUNT(*) FROM information_schema.table_constraints
                    WHERE table_name = 'ds_resposta_questionario'
                      AND constraint_name = 'fk6nxg9ej7jtwk0w5m3c89j4ipu'
                    """, Integer.class);

            if (count != null && count > 0) {
                log.info("[Questionário] FK antiga encontrada — corrigindo para apontar para 'users'...");

                jdbcTemplate.execute("""
                        ALTER TABLE ds_resposta_questionario
                            DROP CONSTRAINT fk6nxg9ej7jtwk0w5m3c89j4ipu
                        """);

                jdbcTemplate.execute("""
                        ALTER TABLE ds_resposta_questionario
                            ADD CONSTRAINT fk_resposta_questionario_user
                            FOREIGN KEY (usuario_id) REFERENCES users(id)
                        """);

                log.info("[Questionário] FK corrigida com sucesso.");
            } else {
                log.debug("[Questionário] FK já está correta, nenhuma ação necessária.");
            }

        } catch (Exception e) {
            log.warn("[Questionário] Não foi possível verificar/corrigir FK: {}", e.getMessage());
        }
    }

    private void adicionarFkUsuarioInfoClinica() {
        try {
            Integer count = jdbcTemplate.queryForObject("""
                    SELECT COUNT(*) FROM information_schema.table_constraints
                    WHERE table_name = 'usuario_info_clinica'
                      AND constraint_name = 'fk_usuario_info_clinica_user'
                    """, Integer.class);

            if (count != null && count == 0) {
                log.info("[UsuarioInfo] Adicionando coluna user_id e FK para users...");

                jdbcTemplate.execute("""
                        ALTER TABLE usuario_info_clinica
                        ADD COLUMN IF NOT EXISTS user_id BIGINT
                        """);

                jdbcTemplate.execute("""
                        ALTER TABLE usuario_info_clinica
                        ADD CONSTRAINT fk_usuario_info_clinica_user
                        FOREIGN KEY (user_id) REFERENCES users(id)
                        """);

                log.info("[UsuarioInfo] FK adicionada com sucesso.");
            } else {
                log.debug("[UsuarioInfo] FK já existe, nenhuma ação necessária.");
            }

        } catch (Exception e) {
            log.warn("[UsuarioInfo] Não foi possível adicionar FK: {}", e.getMessage());
        }
    }
}