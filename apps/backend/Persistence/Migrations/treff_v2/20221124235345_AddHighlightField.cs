using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class AddHighlightField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Premium",
                table: "Freelancers");

            migrationBuilder.AddColumn<bool>(
                name: "ExpressDelivery",
                table: "Services",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Highlight",
                table: "Services",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Invoice",
                table: "Freelancers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Verified",
                table: "Freelancers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpressDelivery",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Highlight",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Invoice",
                table: "Freelancers");

            migrationBuilder.DropColumn(
                name: "Verified",
                table: "Freelancers");

            migrationBuilder.AddColumn<bool>(
                name: "Premium",
                table: "Freelancers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
