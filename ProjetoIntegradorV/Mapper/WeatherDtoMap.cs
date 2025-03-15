using ProjetoIntegradorV.Models.Dto;
using ProjetoIntegradorV.Models;

namespace ProjetoIntegradorV.Mapper
{
    public class WeatherDtoMap
    {
        public static List<WeatherDto> ToDtoList(List<Weather> weathers)
        {
            return weathers
                .GroupBy(w => new { w.InfoDate.Year, w.InfoDate.Month })
                .Select(g => new WeatherDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    AveragePrecipitation = g.Average(w => w.Precipitation),
                    AverageTemperatureC = g.Average(w => w.TemperatureC),
                    DailyWeatherData = g.ToList()
                })
                .ToList();
        }
    }
}
