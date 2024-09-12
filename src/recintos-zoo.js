// Aqui é definida a classe RecintosZoo, que terá métodos e propriedades para gerenciar recintos e animais.
// o construtor é automaticamente chamado para inicializar duas propriedades importantes: this.recintos e this.animaisPermitidos

class RecintosZoo {
    constructor() {
        // O construtor inicializa a classe com uma lista de recintos. Cada recinto tem: numero, bioma, tamanhoTotal, animais.
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        // Aqui, temos um objeto que define as espécies de animais que o zoológico pode receber. Cada espécie tem: Tamanho, biomas, carnivoro.
        this.animaisPermitidos = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    /**
     * Analisa os recintos disponíveis para encontrar quais são viáveis para abrigar o novo animal.
     * 
     * @param {string} animal - O nome da espécie do animal.
     * @param {number} quantidade - A quantidade de indivíduos do animal.
     * @returns {Object} - Um objeto contendo uma lista de recintos viáveis ou uma mensagem de erro.
     * 
     * Se nenhum recinto for viável, retorna { erro: "Não há recinto viável" }.
     * Se o animal for inválido, retorna { erro: "Animal inválido" }.
     * Se a quantidade for inválida, retorna { erro: "Quantidade inválida" }.
     */

    analisaRecintos(animal, quantidade) {
        //  Verifica se o animal passado como argumento está presente no objeto animaisPermitidos
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        // Valida se a quantidade é maior que 0
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
         // Armazena as características da espécie do animal atual, como tamanho e bioma permitido
        const especie = this.animaisPermitidos[animal]; 
        const recintosViaveis = []; // Inicializa um array vazio para registrar os recintos que podem abrigar o novo animal

        // Processa cada recinto para verificar se é viável abrigar o novo animal
        this.recintos.forEach(recinto => {
            // Se o animal for um hipopótamo, ele só pode ficar em recintos com bioma "savana e rio", então ignoramos outros biomas
            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                return; // Pula para o próximo recinto
            }

            // Calcula o espaço ocupado pelos animais existentes no recinto
            let espacoOcupado = recinto.animais.reduce((total, a) => {
                const especieAnimal = this.animaisPermitidos[a.especie]; // Obtém informações da espécie
                return total + (especieAnimal.tamanho * a.quantidade); // Soma o espaço ocupado pelos animais no recinto
            }, 0);

                // Verifica se há mais de uma espécie no recinto. Se houver, será necessário adicionar espaço extra.
            const temMaisDeUmaEspecie = recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === animal);
            const espacoExtra = temMaisDeUmaEspecie ? 1 : 0; // Adiciona 1 de espaço extra se o recinto já tiver animais de outras espécies
            const espacoRestante = recinto.tamanhoTotal - espacoOcupado - espacoExtra;

           // Verifica se o bioma do recinto é compatível com a espécie do animal
            const biomasRecinto = recinto.bioma.split(' e '); // Divide os biomas compostos como "savana e rio"
            const biomaValido = especie.biomas.some(bioma => biomasRecinto.includes(bioma));

            // Verifica se já há carnívoros no recinto
            const carnivoroNoRecinto = recinto.animais.some(a => this.animaisPermitidos[a.especie].carnivoro);

                // Se o bioma for válido e houver espaço suficiente, o recinto pode ser considerado viável
            if (biomaValido && espacoRestante >= especie.tamanho * quantidade) {
                if (especie.carnivoro && (recinto.animais.length === 0 || recinto.animais[0].especie === animal)) {
                    // Carnívoros só podem estar sozinhos ou com a própria espécie
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - especie.tamanho * quantidade} total: ${recinto.tamanhoTotal})`);
                } else if (!especie.carnivoro && !carnivoroNoRecinto) {
                    // Para não-carnívoros: podem compartilhar recinto com outras espécies, desde que não haja carnívoros
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - especie.tamanho * quantidade} total: ${recinto.tamanhoTotal})`);
                }
            }
        });

        // Se nenhum recinto for adequado, retorna uma mensagem de erro
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Retorna a lista de recintos viáveis
        return { recintosViaveis: recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };