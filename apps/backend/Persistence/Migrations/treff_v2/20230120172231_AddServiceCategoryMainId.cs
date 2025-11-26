using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class AddServiceCategoryMainId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryParentId",
                table: "Services");

            migrationBuilder.AddColumn<int>(
                name: "CategoryMainId",
                table: "Services",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryMainId",
                table: "Services");

            migrationBuilder.AddColumn<int>(
                name: "CategoryParentId",
                table: "Services",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
