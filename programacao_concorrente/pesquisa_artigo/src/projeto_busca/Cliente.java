package projeto_busca;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Cliente {
    private static final String HOST_SERVIDOR_A = "localhost";
    private static final int PORTA_SERVIDOR_A = 12345;

    public static void main(String[] args) {
        try (Scanner teclado = new Scanner(System.in)) {
            while (true) {
                System.out.print("\nDigite o que você quer buscar (ou 'sair' para fechar): ");
                String termoBusca = teclado.nextLine();

                if ("sair".equalsIgnoreCase(termoBusca)) {
                    System.out.println("👋 Tchau, tchau!");
                    break;
                }

                if (termoBusca.isBlank()) {
                    System.out.println("⚠️ Por favor, digite algo para buscar.");
                    continue;
                }

                try (
                    Socket socket = new Socket(HOST_SERVIDOR_A, PORTA_SERVIDOR_A);
                    PrintWriter escritor = new PrintWriter(socket.getOutputStream(), true);
                    BufferedReader leitor = new BufferedReader(new InputStreamReader(socket.getInputStream()))
                ) {
                    JSONObject requisicao = new JSONObject();
                    requisicao.put("query", termoBusca);

                    System.out.println("🚀 Enviando '" + termoBusca + "' para o coordenador...");
                    escritor.println(requisicao.toString());

                    String respostaJson = leitor.readLine();
                    JSONArray resultados = new JSONArray(respostaJson);

                    if (resultados.isEmpty()) {
                        System.out.println("\n--- 🤷 Nenhum resultado encontrado. ---");
                    } else {
                        System.out.println("\n--- 📄 Resultados Encontrados (" + resultados.length() + ") ---");
                        for (int i = 0; i < resultados.length(); i++) {
                            Artigo artigo = new Artigo(resultados.getJSONObject(i));
                            System.out.println(artigo);
                            System.out.println("----------------------------------------");
                        }
                    }

                } catch (Exception e) {
                    System.err.println("❌ Ops! Não consegui falar com o servidor: " + e.getMessage());
                }
            }
        }
    }
}