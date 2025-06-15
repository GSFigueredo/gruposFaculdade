package projeto_busca;

public class BoyerMoore {

    private final int R; // O tamanho do alfabeto (radix)
    private final int[] right; // O array de "pulos" do caractere ruim
    private final String padrao; // O termo de busca

    public BoyerMoore(String padrao) {
        this.R = 256; // Alfabeto ASCII Estendido
        this.padrao = padrao;

        // Pré-processamento do padrão para a regra do "caractere ruim"
        right = new int[R];
        for (int c = 0; c < R; c++) {
            right[c] = -1;
        }
        for (int j = 0; j < padrao.length(); j++) {
            right[padrao.charAt(j)] = j;
        }
    }

    /**
     * Busca o padrão no texto.
     * @return o índice da primeira ocorrência ou -1 se não encontrar.
     */
    public int search(String texto) {
        int M = padrao.length();
        int N = texto.length();
        int skip;
        for (int i = 0; i <= N - M; i += skip) {
            skip = 0;
            for (int j = M - 1; j >= 0; j--) {
                if (padrao.charAt(j) != texto.charAt(i + j)) {
                    skip = Math.max(1, j - right[texto.charAt(i + j)]);
                    break;
                }
            }
            if (skip == 0) return i; // Encontrou!
        }
        return -1; // Não encontrou.
    }
}