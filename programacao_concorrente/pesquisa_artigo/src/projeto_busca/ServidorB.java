package projeto_busca;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class ServidorB {
    private static final int PORTA = 12346;
    private static final String ARQUIVO_DADOS = "dados/dados_servidor_b.json";
    private static List<Artigo> baseDeArtigos;

    public static void main(String[] args) throws IOException {
        carregarDados();
        System.out.println("Servidor B pronto! Na porta " + PORTA);

        try (ServerSocket socketServidor = new ServerSocket(PORTA)) {
            while (true) {
                //Aguarda uma conexão do Servidor A.
                try (Socket socketCliente = socketServidor.accept()) {
                    System.out.println("🔗 Servidor A se conectou ao Servidor B.");

                    // Prepara para ler a mensagem e enviar a resposta
                    BufferedReader leitor = new BufferedReader(new InputStreamReader(socketCliente.getInputStream()));
                    PrintWriter escritor = new PrintWriter(socketCliente.getOutputStream(), true);

                    // Lê a ordem de busca
                    String requisicaoJson = leitor.readLine();
                    JSONObject requisicao = new JSONObject(requisicaoJson);
                    String termoBusca = requisicao.getString("query").toLowerCase();
                    System.out.println("🔍 Servidor B buscando por: '" + termoBusca + "'");

                    //Realiza a busca
                    List<Artigo> resultados = buscarArtigos(termoBusca);

                    //Envia o resultado de volta
                    JSONArray arrayResultados = new JSONArray();
                    for(Artigo artigo : resultados) {
                        arrayResultados.put(artigo.toJson());
                    }
                    escritor.println(arrayResultados.toString());
                } catch (IOException e) {
                    System.err.println("Erro no Servidor B: " + e.getMessage());
                } 
            }
        }
    }

    private static void carregarDados() throws IOException {
        System.out.println("📚 Carregando base de dados do Servidor B...");
        String conteudoJson = Files.readString(Paths.get(ARQUIVO_DADOS));
        JSONArray arrayJson = new JSONArray(conteudoJson);
        baseDeArtigos = new ArrayList<>();
        for (int i = 0; i < arrayJson.length(); i++) {
            baseDeArtigos.add(new Artigo(arrayJson.getJSONObject(i)));
        }
        System.out.println("👍" + baseDeArtigos.size() + " artigos carregados no Servidor B.");
    }

    private static List<Artigo> buscarArtigos(String termoBusca) {
        List<Artigo> artigosEncontrados = new ArrayList<>();
        BoyerMoore buscador = new BoyerMoore(termoBusca);
        for (Artigo artigo : baseDeArtigos) {
            if (buscador.search(artigo.titulo().toLowerCase()) != -1 ||
                buscador.search(artigo.introducao().toLowerCase()) != -1) {
                artigosEncontrados.add(artigo);
            }
        }
        return artigosEncontrados;
    }
}