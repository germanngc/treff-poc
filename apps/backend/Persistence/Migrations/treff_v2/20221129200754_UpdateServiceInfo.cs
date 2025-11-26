using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class UpdateServiceInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Services",
                maxLength: 5200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(1200)",
                oldMaxLength: 1200);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Services",
                type: "varchar(1200)",
                maxLength: 1200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 5200);
        }
    }
}
