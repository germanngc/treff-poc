using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class AddFreelancerSkills : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Freelancers",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(10)",
                oldMaxLength: 10);

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "Freelancers",
                maxLength: 5200,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Skills",
                table: "Freelancers");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Freelancers",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 10,
                oldNullable: true);
        }
    }
}
