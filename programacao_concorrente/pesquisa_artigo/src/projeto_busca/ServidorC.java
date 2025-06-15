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


public class ServidorC {
    private static final int PORTA = 12347;
    private static final String ARQUIVO_DADOS = "dados/dados_servidor_c.json";
    private static List<Artigo> baseDeArtigos;

    public static void main(String[] args) throws IOException {
        carregarDados();
        System.out.println("Servidor C pronto! Na porta " + PORTA);

        try (ServerSocket socketServidor = new ServerSocket(PORTA)) {
            while (true) {
                try (Socket socketCliente = socketServidor.accept()) {
                    System.out.println("🔗 Servidor A se conectou ao Servidor C.");
                    
                    BufferedReader leitor = new BufferedReader(new InputStreamReader(socketCliente.getInputStream()));
                    PrintWriter escritor = new PrintWriter(socketCliente.getOutputStream(), true);
                    
                    String requisicaoJson = leitor.readLine();
                    JSONObject requisicao = new JSONObject(requisicaoJson);
                    String termoBusca = requisicao.getString("query").toLowerCase();
                    System.out.println("🔍 Servidor C buscando por: '" + termoBusca + "'");
                    
                    List<Artigo> resultados = buscarArtigos(termoBusca);
                    
                    JSONArray arrayResultados = new JSONArray();
                    for(Artigo artigo : resultados) {
                        arrayResultados.put(artigo.toJson());
                    }
                    escritor.println(arrayResultados.toString());
                } catch (IOException e) {
                    System.err.println("Erro no Servidor C: " + e.getMessage());
                }
            }
        }
    }
    
    private static void carregarDados() throws IOException {
        System.out.println("📚 Carregando base de dados do Servidor C...");
        String conteudoJson = Files.readString(Paths.get(ARQUIVO_DADOS));
        JSONArray arrayJson = new JSONArray(conteudoJson);
        baseDeArtigos = new ArrayList<>();
        for (int i = 0; i < arrayJson.length(); i++) {
            baseDeArtigos.add(new Artigo(arrayJson.getJSONObject(i)));
        }
        System.out.println("👍 " + baseDeArtigos.size() + " artigos carregados no Servidor C.");
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