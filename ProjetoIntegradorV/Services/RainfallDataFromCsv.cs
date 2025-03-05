using Microsoft.AspNetCore.Hosting;
using ProjetoIntegradorV.Data;
using ProjetoIntegradorV.interfaces;
using ProjetoIntegradorV.Models;

namespace ProjetoIntegradorV.Services
{
    public class RainfallDataFromCsv : IRainfallDataFromCsv
    {
        private readonly IServiceProvider _serviceProvider;
        ISaveDataFromCsvService _saveDataFromCsvService;
        public RainfallDataFromCsv(IServiceProvider serviceProvider, ISaveDataFromCsvService saveDataFromCsvService)
        {
            _serviceProvider = serviceProvider;
            _saveDataFromCsvService = saveDataFromCsvService;
        }

        public List<Weather> getRainfallData()
        {
            if (!_saveDataFromCsvService.HasWeatherData())
            {
                StartRainfallData();
            }
            return _saveDataFromCsvService.GetAllWeatherData();
        }

        public void StartRainfallData()
        {
            _ = StartRainfallDataGetterAsync(CancellationToken.None);
        }

        public async Task StartRainfallDataGetterAsync(CancellationToken cancellationToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                _saveDataFromCsvService.SeedDataFromCsv("projetointegra03.csv");
            }
            await Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
