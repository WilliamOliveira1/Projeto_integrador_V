using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoIntegradorV.Models
{
    public class Weather
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public DateTime InfoDate { get; set; }
        [Required]
        public float Precipitation { get; set; }

        public float Humidity { get; set; }

        [Required]
        [MaxLength(4)]
        public float TemperatureC { get; set; }
    }
}