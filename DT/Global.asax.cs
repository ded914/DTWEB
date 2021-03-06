﻿using Neo4j.Driver.V1;
using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace DT
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            //WebApiConfig.Register(GlobalConfiguration.Configuration);
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        public static IDriver _NeoDTDriver = null;
        public static IDriver NeoDTDriver {
            get {
                if (_NeoDTDriver == null) {
                    _NeoDTDriver = GraphDatabase.Driver(Properties.Settings.Default.DTGraphDB, AuthTokens.Basic(Properties.Settings.Default.DTGraphUser, Properties.Settings.Default.DTGraphPassword));
                }
                return _NeoDTDriver;
            }
        }
    }
}