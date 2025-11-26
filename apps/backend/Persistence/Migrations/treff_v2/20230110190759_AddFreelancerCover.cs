using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class AddFreelancerCover : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cover",
                table: "Freelancers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cover",
                table: "Freelancers");
        }
    }
}
