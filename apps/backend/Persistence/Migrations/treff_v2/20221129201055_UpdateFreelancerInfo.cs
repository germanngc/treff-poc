using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class UpdateFreelancerInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WhyMe",
                table: "Freelancers",
                maxLength: 5200,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WhyMe",
                table: "Freelancers");
        }
    }
}
