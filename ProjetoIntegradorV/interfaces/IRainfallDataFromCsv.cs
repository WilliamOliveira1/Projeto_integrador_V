using ProjetoIntegradorV.Models;

namespace ProjetoIntegradorV.interfaces
{
    public interface IRainfallDataFromCsv
    {
        void StartRainfallData();
        Task StartRainfallDataGetterAsync(CancellationToken cancellationToken);

        List<Weather> getRainfallData();
    }
}