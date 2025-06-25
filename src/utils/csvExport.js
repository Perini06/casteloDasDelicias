import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Exporta as reuniões como CSV e abre a tela de compartilhamento
 * @param {Array} reunioes - Lista de reuniões no formato [{ titulo, data, participantes }]
 */
export async function exportarCSV(reunioes) {
  if (!reunioes || reunioes.length === 0) {
    alert('Não há reuniões para exportar.');
    return;
  }

  // Cabeçalho
  let csvContent = 'Título,Data,Participantes\n';

  // Linhas
  for (const r of reunioes) {
    const participantes = Array.isArray(r.participantes) ? r.participantes.join('; ') : '';
    csvContent += `"${r.titulo}","${r.data}","${participantes}"\n`;
  }

  const fileUri = FileSystem.documentDirectory + 'reunioes.csv';

  try {
    await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert('Compartilhamento não está disponível neste dispositivo.');
    }
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar o arquivo CSV.');
  }
}
