using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoIntegradorV.interfaces;
using ProjetoIntegradorV.Models;
using ProjetoIntegradorV.Models.Dto;
using ProjetoIntegradorV.Mapper;
using System.Collections.Generic;
using System.Linq;

namespace ProjetoIntegradorV.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PrecipitationAnalisisController : ControllerBase
    {
        private readonly ILogger<PrecipitationAnalisisController> _logger;
        private readonly IRainfallDataFromCsv _rainfallDataFromCsv;

        public PrecipitationAnalisisController(ILogger<PrecipitationAnalisisController> logger, IRainfallDataFromCsv rainfallDataFromCsv)
        {
            _logger = logger;
            _rainfallDataFromCsv = rainfallDataFromCsv;
        }

        [HttpGet]
        public ActionResult<IEnumerable<WeatherDto>> GetRainfallData()
        {
            List<Weather> weatherEntities = _rainfallDataFromCsv.getRainfallData();
            var weatherDtos = WeatherDtoMap.ToDtoList(weatherEntities);
            return Ok(weatherDtos);
        }

        [HttpPost]
        public ActionResult<IEnumerable<WeatherDto>> PostRainfallData(
            [FromQuery(Name = "humidity")] string humidity, 
            [FromQuery(Name = "temperature")] string temperature, 
            [FromQuery(Name = "date")] string date)
        {
            bool isDataSaved = _rainfallDataFromCsv.saveNewRainfallData(humidity, temperature, date);
            if(isDataSaved)
            {
                return Ok();
            } else
            {
                return BadRequest();
            }
            
        }
    }
}