using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class CategoryImagesCoverVertical : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImage",
                table: "categories",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerticalImage",
                table: "categories",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImage",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "VerticalImage",
                table: "categories");
        }
    }
}
