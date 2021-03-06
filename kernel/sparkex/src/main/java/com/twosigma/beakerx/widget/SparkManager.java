/*
 *  Copyright 2018 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.twosigma.beakerx.widget;

import com.twosigma.beakerx.TryResult;
import com.twosigma.beakerx.kernel.KernelFunctionality;
import com.twosigma.beakerx.message.Message;
import org.apache.spark.SparkConf;
import org.apache.spark.SparkContext;
import org.apache.spark.sql.SparkSession;

import java.util.List;

public interface SparkManager {

  TryResult configure(KernelFunctionality kernel, SparkUIManager sparkContextManager, Message parentMessage);

  SparkSession getOrCreate();

  SparkConf getSparkConf(List<SparkConfiguration.Configuration> configurations);

  SparkContext sparkContext();

  SparkSession.Builder getBuilder();

  String getSparkAppId();

  interface SparkManagerFactory {
    SparkManager create(SparkSession.Builder sparkSessionBuilder);
  }
}
