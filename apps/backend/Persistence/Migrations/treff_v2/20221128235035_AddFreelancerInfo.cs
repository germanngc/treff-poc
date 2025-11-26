using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations.treff_v2
{
    public partial class AddFreelancerInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ActiveDate",
                table: "Freelancers",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Freelancers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Freelancers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Freelancers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActiveDate",
                table: "Freelancers");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Freelancers");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Freelancers");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Freelancers");
        }
    }
}
