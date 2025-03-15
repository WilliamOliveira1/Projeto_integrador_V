using CsvHelper.Configuration;
using ProjetoIntegradorV.Models;

namespace ProjetoIntegradorV.Mapper
{
    public sealed class WeatherMap : ClassMap<Weather>
    {
        public WeatherMap()
        {
            Map(m => m.ID).Name("ID");
            Map(m => m.InfoDate).Name("infoDate").TypeConverterOption.Format("yyyy-MM-dd");
            Map(m => m.Precipitation).Name("Precipitation");
            Map(m => m.TemperatureC).Name("TemperatureC");
        }
    }
}
