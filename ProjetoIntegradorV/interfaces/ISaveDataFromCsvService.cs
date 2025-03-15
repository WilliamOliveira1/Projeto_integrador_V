using ProjetoIntegradorV.Models;

namespace ProjetoIntegradorV.interfaces
{
    public interface ISaveDataFromCsvService
    {
        void SeedDataFromCsv(string csvFilePath);

        List<Weather> GetAllWeatherData();

        bool HasWeatherData();

        void DeleteAllWeatherData();

        bool SaveWeatherData(Weather wheather);
    }
}