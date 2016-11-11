using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Neo4j.Driver.V1;

namespace DT
{
    public static class WebApiConfig
    {
        public static IDriver NeoDTDriver = null;
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            NeoDTDriver = GraphDatabase.Driver(Properties.Settings.Default.DTGraphDB, AuthTokens.Basic(Properties.Settings.Default.DTGraphUser, Properties.Settings.Default.DTGraphPassword));
        }
    }
}
