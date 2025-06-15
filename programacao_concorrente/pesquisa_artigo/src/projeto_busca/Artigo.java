package projeto_busca;

import org.json.JSONObject;

// Criar uma classe de dados de forma concisa.
public record Artigo(String titulo, String introducao) {

    /**
     * JSON para Objeto
     */
	public Artigo(JSONObject json) {
        this(
            json.optString("title", "Título não encontrado"), // Pega o título. Se não achar, usa o valor padrão.
            json.optString("introduction", "")             // Pega a introdução. Se não achar, usa uma string vazia.
        );
    }

    /**
     * Objeto para JSON
     */
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("title", titulo);
        json.put("introduction", introducao);
        return json;
    }

    @Override
    public String toString() {
        return "TÍTULO: " + titulo + "\nINTRODUÇÃO: " + introducao + "\n";
    }
}