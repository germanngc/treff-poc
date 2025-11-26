using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class CreateServicesTablesFreelancer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FreelancerId",
                table: "Services",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Services_FreelancerId",
                table: "Services",
                column: "FreelancerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Freelancers_FreelancerId",
                table: "Services",
                column: "FreelancerId",
                principalTable: "Freelancers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Services_Freelancers_FreelancerId",
                table: "Services");

            migrationBuilder.DropIndex(
                name: "IX_Services_FreelancerId",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "FreelancerId",
                table: "Services");
        }
    }
}
