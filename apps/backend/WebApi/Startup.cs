using Application;
using Application.Interfaces.Repositories.Base;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Persistence;
using Persistence.Context;
using Persistence.Repositories.Base;
using System;
using System.IO;
using System.Reflection;
using System.Text.Json.Serialization;
using AutoMapper;
using MAD.Infrastructure.Services;
using Persistence.Services;
using WebApi.Hubs;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("ClientPermission", policy =>
            //    {
            //        policy.AllowAnyHeader()
            //            .AllowAnyMethod()
            //            .WithOrigins("http://localhost:3000")
            //            .AllowCredentials();
            //    });
            //});

            services.AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.MaxDepth = 24;
                }
            );
            services.AddAutoMapper(typeof(Startup));
            services.AddMediatR(Assembly.GetExecutingAssembly());
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<treff_v2Context>(m =>
            {
                m.UseMySQL(connectionString);
                m.ConfigureWarnings(warnings =>

            warnings.Ignore(CoreEventId.NavigationBaseIncludeIgnored));
            },
                ServiceLifetime.Transient);
            services.Configure<Persistence.Services.AwsS3Config>(opts => Configuration.GetSection("AWS").Bind(opts));
            services.Configure<TwilioConfig>(opts => Configuration.GetSection("TwilioConfig").Bind(opts));
            #region Swagger
            //services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddSignalR();
            #endregion
            #region Api Versioning
            // Add API Versioning to the Project
            services.AddApiVersioning(config =>
            {
                // Specify the default API Version as 1.0
                config.DefaultApiVersion = new ApiVersion(1, 0);
                // If the client hasn't specified the API version in the request, use the default API version number 
                config.AssumeDefaultVersionWhenUnspecified = true;
                // Advertise the API versions supported for the particular endpoint
                config.ReportApiVersions = true;
            });
            #endregion
            services.AddApplication();
            services.AddPersistence(Configuration);
            services.AddControllers();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(options =>
            {
                options.WithOrigins("http://localhost:3000", "http://localhost:5000", "http://localhost:5001", "https://maxvazquezg.github.io/", "https://maxvazquezg.github.io/treff-site");
                options.AllowAnyMethod();
                options.AllowAnyHeader();
                options.AllowCredentials();
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles(); // For the wwwroot folder

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                                    Path.Combine(Directory.GetCurrentDirectory(), @"Images")),
                RequestPath = new PathString("/Images")
            });


            // Commented out for local development to avoid certificate issues
            // app.UseHttpsRedirection();
            //app.UseCors("ClientPermission");
            app.UseRouting();

            app.UseAuthorization();
            #region Swagger
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "TreffServices");
            });
            #endregion
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/hubs/chat");
                endpoints.MapHub<NotificationHub>("/hubs/notification");
                endpoints.MapHub<MessageHub>("/hubs/message");
            });
        }
    }
}
