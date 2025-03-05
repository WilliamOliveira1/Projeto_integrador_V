using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoIntegradorV.Data.Migrations
{
    public partial class RainFallToFloat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "TemperatureC",
                table: "Weather",
                type: "real",
                maxLength: 4,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldMaxLength: 4);

            migrationBuilder.AlterColumn<float>(
                name: "Precipitation",
                table: "Weather",
                type: "real",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TemperatureC",
                table: "Weather",
                type: "int",
                maxLength: 4,
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real",
                oldMaxLength: 4);

            migrationBuilder.AlterColumn<int>(
                name: "Precipitation",
                table: "Weather",
                type: "int",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }
    }
}
